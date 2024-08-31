function start(element) {
    var id = element.id;
    var href = window.location.href;
    var replaceLink = href + id + '/'
    console.log(`ID: ${id}, Href: ${href}, ReplaceLink: ${replaceLink}`)
    window.location.replace(replaceLink);
}