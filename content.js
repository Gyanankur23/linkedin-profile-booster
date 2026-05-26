(function() {
  const nameElement = document.querySelector('h1.text-heading-xlarge');
  const headlineElement = document.querySelector('.text-body-medium.break-words');
  const aboutElement = document.querySelector('#about + div + div span.visual-line-height');

  return {
    name: nameElement ? nameElement.innerText.trim() : "Not Found",
    headline: headlineElement ? headlineElement.innerText.trim() : "Not Found",
    about: aboutElement ? aboutElement.innerText.trim() : "Not Found"
  };
})();
