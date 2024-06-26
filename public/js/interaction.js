// Event handlers and interactions.

// Create functions for buttons.
function attachEventHandlers() {
    // News feed element buttons.

    // Remove button removes from main feed and adds it to the 'removed' section.
    $('body').on('click', '.remove-button', function () {
        if ($(this).parent().parent().parent().parent().attr('id') === 'feed-container'
            || $(this).parent().parent().parent().parent().attr('id') === 'removed-container') {
            const closeButtonId = '#close' + $(this).closest('.newsElement').attr('id');
            const newsElementId = $(this).closest('.newsElement').attr('id');
            const newsElementClone = $(this).closest('.newsElement').clone(true);
            addRemoveItemsFromContainer('#removed-container', newsElementId, newsElementClone, true, closeButtonId);
        }
    });

    // Flag button changes the color of the flag and adds it into the 'read later' section.
    $('body').on('click', '.flag-button', function () {
        if ($(this).parent().parent().parent().parent().attr('id') === 'feed-container') {
            // Css changes.
            $(this).toggleClass('flag-button-clicked');
            const newsElement = $(this).closest('.newsElement').clone(true);
            newsElement.toggleClass('flag-button-not-clickable');
            newsElement.toggleClass('like-button-not-clickable');
            const newsElementId = $(this).closest('.newsElement').attr('id');
            // Add element to given container. On second click remove it from there.
            addRemoveItemsFromContainer('#later-container', newsElementId, newsElement, false)
        }
    });

    // Like button changes the color of heart icon and adds it into the 'liked' section.
    $('body').on('click', '.like-button', function () {
        if ($(this).parent().parent().parent().parent().attr('id') === 'feed-container') {
            $(this).toggleClass('like-button-clicked');
            const newsElement = $(this).closest('.newsElement').clone(true);
            const newsElementId = $(this).closest('.newsElement').attr('id');
            // Add element to given container. On second click remove it from there.
            addRemoveItemsFromContainer('#liked-container', newsElementId, newsElement, false)
        }
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

    // Category choosing
    $('.choose-ai').on('click', function() {
        this.classList.toggle('toggled'); // toggle animation.

        // Remove others toggled visuals.
        $('.read-later-news').removeClass('toggled');
        $('.liked-news').removeClass('toggled');

        // hide current container and display next.
        toggleContainers(getCurrentVisibleContainer(), '#ai-container')
    });
    $('.choose-tech').on('click', function() {
        this.classList.toggle('toggled'); // toggle animation.

        // Remove others toggled visuals.
        $('.read-later-news').removeClass('toggled');
        $('.liked-news').removeClass('toggled');

        // hide current container and display next.
        toggleContainers(getCurrentVisibleContainer(), '#tech-container')
    });
}

// Add or remove news from feed depending on whether it is present or not.
function addRemoveItemsFromContainer(container, elementId, newsElement, isRemove, closeButtonId) {
    // Adds new element if not present.
    if ($(container).find(`#${elementId}`).length === 0) {
        $(container).append(newsElement); // Append the cloned newsElement if it's the first one
        if (isRemove) {
            let closeButton = $(closeButtonId);
            const newsElementToRemove = $('#feed-container').find(`#${elementId}`).first();
            newsElementToRemove.remove();
        }
    } else {
        // Removes element from container.
        const newsElementToRemove = $(container).find(`#${elementId}`).first();
        newsElementToRemove.remove();
        // Inserts div back to correct spot.
        if (isRemove) {
            let lastDiv;
            let elemFitted = false;
            let divs = $("#feed-container").children();
            $.each(divs, function(index, element) {
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
    let divs = $("#feed-container").children();
    console.log('divs ' + divs);

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
        $('.pick-category').show();
        return
    }
    $(currentContainer).hide();
    $(nextContainer).toggle();

    // Made category picking disappear if any of the custom ones has been chosen.
    if (nextContainer!== '#tech-container' && nextContainer!== '#ai-container') {
        $('.pick-category').hide();
    }
}

// returns the current visible container.
function getCurrentVisibleContainer() {
    let containers = ['#feed-container', '#removed-container', '#liked-container', '#later-container',
        '#tech-container', '#ai-container'];
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
        later: $('#later-container').html(),
        ai: $('#ai-container').html(),
        tech: $('#tech-container').html()
    };

    // Save current state.
    localStorage.setItem('containerState', JSON.stringify(newState));
}
