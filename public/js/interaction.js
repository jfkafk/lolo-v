// Event handlers and interactions.

// Create functions behind buttons.
function attachEventHandlers() {
    // News feed element buttons.

    // Remove button removes from main feed and adds it to the 'removed' section.
    $('body').on('click', '.remove-button', function () {
        const closeButtonId = '#close' + $(this).closest('.newsElement').attr('id');
        const newsElementClone = $(this).closest('.newsElement').clone(true);
        $('#removed-container').append(newsElementClone);
        $(closeButtonId).parent().parent().remove(); // Remove the parent div of the clicked button
        saveContainerState();
    });

    // Flag button changes the color of the flag and adds it into the 'read later' section.
    $('body').on('click', '.flag-button', function () {
        // Directly use the index to find the corresponding "close" button
        const newsElementClone = $(this).closest('.newsElement').clone(true);
        $('#later-container').append(newsElementClone);
        saveContainerState();
    });

    // Like button changes the color of heart icon and adds it into the 'liked' section.
    $('body').on('click', '.like-button', function () {
        // Directly use the index to find the corresponding "close" button
        const newsElementClone = $(this).closest('.newsElement').clone(true);
        $('#liked-container').append(newsElementClone);
        saveContainerState();
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
