const Mail = () => {
  const mail = document.querySelector(".mail");
  mail.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "mailto:info@grzegorztomicki.pl";
  });
};

export default Mail;
