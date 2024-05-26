// Remove button removes from main feed and adds it to the 'removed' section.
$('body').on('click', '.remove-button', function () {
    const closeButtonId = '#close' + $(this).closest('.newsElement').attr('id');
    const newsElementClone = $(this).closest('.newsElement').clone(true);
    $('#removed-container').append(newsElementClone);
    $(closeButtonId).parent().parent().remove(); // Remove the parent div of the clicked button
});
$('.removed-news').on('click', function() {
    this.classList.toggle('toggled'); // toggle animation.
    $('.read-later-news').removeClass('toggled');
    $('.liked-news').removeClass('toggled');
    toggleContainers(getCurrentVisibleContainer(), '#removed-container')
});

// Flag button changes the color of the flag and adds it into the 'read later' section.
$('body').on('click', '.like-button', function () {
    // Directly use the index to find the corresponding "close" button
    const newsElementClone = $(this).closest('.newsElement').clone(true);
    $('#liked-container').append(newsElementClone);
});
$('.liked-news').on('click', function() {
    this.classList.toggle('toggled'); // toggle animation.
    $('.read-later-news').removeClass('toggled');
    $('.removed-news').removeClass('toggled');

    toggleContainers(getCurrentVisibleContainer(), '#liked-container');
});

// Like button changes the color of heart icon and adds it into the 'liked' section.
$('body').on('click', '.flag-button', function () {
    // Directly use the index to find the corresponding "close" button
    const newsElementClone = $(this).closest('.newsElement').clone(true);
    $('#later-container').append(newsElementClone);
});
$('.read-later-news').on('click', function() {
    this.classList.toggle('toggled'); // toggle animation.
    $('.liked-news').removeClass('toggled');
    $('.removed-news').removeClass('toggled');
    toggleContainers(getCurrentVisibleContainer(), '#later-container');
});

// to toggle the visibility of the current and next containers
function toggleContainers(currentContainer, nextContainer) {
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