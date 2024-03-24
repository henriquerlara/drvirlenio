emailjs.init("0STCn7LKawPoxVia3");

document.getElementById('meuFormulario').addEventListener('submit', function(event) {
    event.preventDefault();
    var form = document.getElementById('meuFormulario');
    
    emailjs.sendForm('service_bwsvo1u', 'template_2sbhkvs', this)
        .then(function() {
            alert('Mensagem enviada com sucesso!');
            form.reset();
        }, function(error) {
            alert('Falha ao enviar mensagem: ' + JSON.stringify(error));
        });
});