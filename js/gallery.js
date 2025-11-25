document.addEventListener("DOMContentLoaded", function () {
    const modalHTML = `
        <div class="modal fade" id="imageModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content bg-dark text-light">
                    <div class="modal-header border-0">
                        <h5 id="modalCaption" class="modal-title"></h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img id="modalImage" src="" alt="Image" class="img-fluid">
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const imageModal = new bootstrap.Modal(document.getElementById("imageModal"));
    const modalImage = document.getElementById("modalImage");
    const modalCaption = document.getElementById("modalCaption");

    const galleryImages = document.querySelectorAll("main img");

    galleryImages.forEach(img => {
        img.style.cursor = "pointer";
        img.addEventListener("click", function () {
            modalImage.src = this.src;
            modalCaption.textContent = translations[currentLang]["season"] + " " + this.alt;
            imageModal.show();
        });
    });
});
