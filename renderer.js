document.addEventListener("DOMContentLoaded", function () {
  const fileLabel = document.getElementById("fileLabel");
  const file = document.getElementById("file");
  const displayImg = document.getElementById("displayImg");
  const form = document.getElementById("form");
  const widthInput = document.getElementById("widthInput");
  const heightInput = document.getElementById("heightInput");
  const resizeBtn = document.getElementById("resizeBtn");
  const msg = document.getElementById("msg");

  file.addEventListener("change", function (e) {
    const types = ["image/jpeg", "image/png", "image/jpg"];

    const file = e.target.files[0];
    if (!types.includes(file.type)) {
      console.log(types.includes(file.type));
      window.electronAPI.sendMsg("wrong file type");
      return;
    }

    const url = URL.createObjectURL(file);
    displayImg.src = url;
    displayImg.style.display = "block";

    const image = new Image();
    image.src = url;

    image.addEventListener("load", function () {
      const width = image.naturalWidth;
      const height = image.naturalHeight;

      widthInput.value = width;
      heightInput.value = height;
      form.style.display = "flex";
      resizeBtn.classList.remove("hidden");
      resizeBtn.classList.add("flex");
    });
    resizeBtn.addEventListener("click", () => {
      const types = ["image/jpeg", "image/png", "image/jpg"];

      if (!types.includes(file.type)) {
        console.log(types.includes(file.type));
        window.electronAPI.sendMsg("wrong file type");
        return;
      }
      // sending dimension to main
      window.electronAPI.render_dim_file_main({
        filePath: file.path,
        height: heightInput.value,
        width: widthInput.value,
      });
    });
  });
});
