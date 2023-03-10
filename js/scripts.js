const links = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("section");

links.forEach(link => {
  link.addEventListener("click", function(event) {
    event.preventDefault();
    const href = this.getAttribute("href");
    const section = document.querySelector(href);
    sections.forEach(section => {
      section.classList.remove("active");
    });
    section.classList.add("active");
    links.forEach(link => {
      link.classList.remove("active");
    });
    this.classList.add("active");
  });
});




  document.querySelector("#compara-imagens-menu").addEventListener("click", function() {
    document.querySelector("#compara-imagens").style.display = "block";
    document.querySelector("#detectar-emocoes").style.display = "none";
  });
  document.querySelector("#detectar-emocoes-menu").addEventListener("click", function() {
    document.querySelector("#compara-imagens").style.display = "none";
    document.querySelector("#detectar-emocoes").style.display = "block";
  });