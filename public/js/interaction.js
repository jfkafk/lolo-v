// Event handlers and interactions.

// Create functions behind buttons.
function attachEventHandlers() {
    $('.newsElement').hover(
        function() {
            // Mouse enters
            $(this).addClass('active');
        },
        function() {
            // Mouse leaves
            $(this).removeClass('active');
        }
    );

    // News feed element buttons.

    // Remove button removes from main feed and adds it to the 'removed' section.
    $('body').on('click', '.remove-button', function () {
        const closeButtonId = '#close' + $(this).closest('.newsElement').attr('id');
        const newsElementId = $(this).closest('.newsElement').attr('id');
        const newsElementClone = $(this).closest('.newsElement').clone(true);
        addRemoveItemsFromContainer('#removed-container', newsElementId, newsElementClone, true, closeButtonId);
    });

    // Flag button changes the color of the flag and adds it into the 'read later' section.
    $('body').on('click', '.flag-button', function () {
        // Directly use the index to find the corresponding "close" button
        const newsElement = $(this).closest('.newsElement').clone(true);
        const newsElementId = $(this).closest('.newsElement').attr('id');
        // Add element to given container. On second click remove it from there.
        addRemoveItemsFromContainer('#later-container', newsElementId, newsElement, false)
    });

    // Like button changes the color of heart icon and adds it into the 'liked' section.
    $('body').on('click', '.like-button', function () {
        const newsElement = $(this).closest('.newsElement').clone(true);
        const newsElementId = $(this).closest('.newsElement').attr('id');
        // Add element to given container. On second click remove it from there.
        addRemoveItemsFromContainer('#liked-container', newsElementId, newsElement, false)
    });

    // Header navbar buttons.
    $('.removed-news').on('click', function() {
        this.classList.toggle('toggled'); // toggle animation.

        // Remove others toggled visuals.
        $('.read-later-news').removeClass('toggled');
        $('.liked-news').removeClass('toggled');

        // hide current container and display next.
        toggleContainers(getCurrentVisibleContainer(), '#removed-container')
    });

    $('.liked-news').on('click', function() {
        this.classList.toggle('toggled'); // toggle animation.

        // Remove others toggled visuals.
        $('.read-later-news').removeClass('toggled');
        $('.removed-news').removeClass('toggled');

        // hide current container and display next.
        toggleContainers(getCurrentVisibleContainer(), '#liked-container');
    });

    $('.read-later-news').on('click', function() {
        this.classList.toggle('toggled'); // toggle animation.

        // Remove others toggled visuals.
        $('.liked-news').removeClass('toggled');
        $('.removed-news').removeClass('toggled');

        // hide current container and display next.
        toggleContainers(getCurrentVisibleContainer(), '#later-container');
    });
}

// Add or remove news from feed depending on whether it is present or not.
function addRemoveItemsFromContainer(container, elementId, newsElement, isRemove, closeButtonId) {
    // Adds new element if not present.
    if ($(container).find(`#${elementId}`).length === 0) {
        $(container).append(newsElement); // Append the cloned newsElement if it's the first one
        if (isRemove) {
            $(closeButtonId).parent().parent().remove(); // Remove the parent div of the clicked button
        }
    } else {
        // Removes element from container.
        const newsElementToRemove = $(container).find(`#${elementId}`).first();
        newsElementToRemove.remove();
        // Inserts div back to correct spot.
        if (isRemove) {
            let lastDiv;
            let elemFitted = false;
            $(".newsElement").each(function(index, element) {
                elem = element;
                // Check if the current element is not the last.newsElement
                if (Number($(element).attr('id')) > Number(elementId)) {
                    // Insert the new div before the next.newsElement
                    $(newsElement).insertBefore(element);
                    elemFitted = true;
                    return false;
                } else {
                    lastDiv = element;
                }
            });
            // If did not fit anywhere.
            if (!elemFitted) {
                $('#feed-container').append(newsElement);
            }
        }
    }
    sortDates()
    saveContainerState();
}

// Order the feed according to the id's.
function sortDates() {
    let divs = $("#feed-container.newsElement").toArray();

    // Sort the array based on the id attribute of each div
    divs.sort(function(a, b) {
        return parseInt(a.id) - parseInt(b.id);
    });

    // Iterate through the sorted array and append each div back to the parent div
    $.each(divs, function(index, div) {
        $("#feed-container").append(div);
    });
}

// hide current container and display new one.
function toggleContainers(currentContainer, nextContainer) {
    // clicking twice closes the container and displays the main feed.
    if (currentContainer === nextContainer) {
        $(currentContainer).toggle();
        $('#feed-container').toggle()
        return
    }
    $(currentContainer).hide();
    $(nextContainer).toggle();
}

// returns the current container.
function getCurrentVisibleContainer() {
    let containers = ['#feed-container', '#removed-container', '#liked-container', '#later-container'];
    let visibleContainer = '';

    containers.forEach(function(container) {
        if ($(container).is(":visible")) {
            visibleContainer = container;
        }
    });
    return visibleContainer;
}

// Save all containers current state.
function saveContainerState() {
    // Clear to avoid duplications.
    localStorage.clear();

    const newState = {
        feed: $('#feed-container').html(),
        removed: $('#removed-container').html(),
        liked: $('#liked-container').html(),
        later: $('#later-container').html()
    };

    // Save current state.
    localStorage.setItem('containerState', JSON.stringify(newState));
}
