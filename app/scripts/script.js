document.addEventListener("DOMContentLoaded", function() {
    const main = document.getElementById("main");
    console.log(main.innerHTML);
    main.innerHTML += "Hello world";
});