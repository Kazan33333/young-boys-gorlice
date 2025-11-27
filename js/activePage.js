document.addEventListener("DOMContentLoaded", () => {
    let currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "") currentPage = "index.html";

    document.querySelectorAll(".nav-link[href]").forEach(link => {
        const linkPage = link.getAttribute("href");
        if (currentPage === linkPage) {
            link.classList.add("active-page");
        }
    });
});
