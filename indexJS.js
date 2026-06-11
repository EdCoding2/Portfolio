const titles = document.querySelectorAll(".project-title");

titles.forEach(title => {

    title.addEventListener("click", () => {

        const card = title.parentElement;

        card.classList.toggle("active");

    });

});