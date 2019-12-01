import fullpage from 'fullpage.js';


var fullPageInstance = new fullpage('#danicaland-wrapper', {
    licenseKey: '4E562527-BBC249E6-9F4E4D8A-CB43F95F',
    autoScrolling: true,
    anchors: ['first', 'second', 'third','fourth','fifth','sixth','seventh', 'footer'],
    scrollingSpeed: 1000,
    ccs3: true,
    sectionSelector: '.fullpagesection',
    afterLoad: function (origin, destination) {
        var loadedSection = this;

        //использование индекса
        if (destination.anchor == 'first') {
            console.log("Section 1 ended loading", destination.item);
            getClassList(destination.item);
        }
        if (destination.anchor == 'second') {
            console.log("Section 2 ended loading", destination.item);
            getClassList(destination.item);
        }
        if (destination.anchor == 'third') {
            console.log("Section 3 ended loading", destination.item);
            getClassList(destination.item);
        }
        if (destination.anchor == 'fourth') {
            console.log("Section 4 ended loading", destination.item);
            getClassList(destination.item);
        }
        if (destination.anchor == 'fifth') {
            console.log("Section 5 ended loading", destination.item);
            getClassList(destination.item);
        }
        if (destination.anchor == 'sixth') {
            console.log("Section 6 ended loading", destination.item);
            getClassList(destination.item);
        }
        if (destination.anchor == 'seventh') {
            console.log("Section 7 ended loading", destination.item);
            getClassList(destination.item);
        }
    }
});

// check if animation class classList in arr ifnot add it  
function getClassList (el) {
   if(!el.classList.contains("animation")){
       return el.classList.add("animation");
   }
}