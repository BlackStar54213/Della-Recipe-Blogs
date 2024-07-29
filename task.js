const trash = document.querySelector("a.delete");

trash.addEventListener("click", () => {
    const endpoint = `/blogs/${trash.dataset.doc}`;

    fetch(endpoint, { method: 'DELETE' })
        .then((result) => console.log("Blog has been deleted"))
        .catch((err) => console.log(err));
})