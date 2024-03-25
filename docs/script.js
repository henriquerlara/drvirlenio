var mymap = L.map('mapid').setView([-19.789097772703872, -42.14306289112699], 80);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mymap);

    var clinicMarker = L.marker([-19.789097772703872, -42.14306289112699]).addTo(mymap);

    var addressInput = document.getElementById('addressInput');
    var addressSuggestions = document.getElementById('addressSuggestions');

    function showRoute(lat, lng) {
        
        if (routingControl) {
            mymap.removeControl(routingControl);
        }

        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(lat, lng),
                clinicMarker.getLatLng()
            ],
            routeWhileDragging: false,
            showAlternatives: false,
        }).addTo(mymap);

        mymap.fitBounds(L.latLngBounds([lat, lng], clinicMarker.getLatLng()));
        
    }

    addressInput.addEventListener('input', function() {
        var inp = document.getElementById('addressSuggestions');
        var value = addressInput.value;
        if (value.length < 3) {
            addressSuggestions.innerHTML = '';
            inp.style.display = 'none'; // Oculta o campo de sugestões quando o valor é muito curto
            return;
        }
    
        fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(value + ', Brazil' + ', Minas Gerais')}&limit=5`)
        .then(response => response.json())
        .then(data => {
            if (data.features.length === 0) {
                addressSuggestions.innerHTML = '<li>Não foram encontradas sugestões para este endereço.</li>';
                inp.style.display = 'none'; // Oculta o campo de sugestões quando não há sugestões
                return;
            }
            addressSuggestions.innerHTML = '';
            data.features.forEach(function(feature) {
                inp.style.display = "block";
                var li = document.createElement('li');
                var textContent = feature.properties.name;
                if (feature.properties.housenumber) textContent += ', ' + feature.properties.housenumber;
                if (feature.properties.street) textContent += ', ' + feature.properties.street;
                textContent += ', ' + feature.properties.city + ', ' + feature.properties.state + ', ' + feature.properties.country;
                li.textContent = textContent;
                li.style.cursor = 'pointer';
                li.addEventListener('click', function() {
                    addressInput.value = textContent;
                    addressSuggestions.innerHTML = '';
                    showRoute(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
                    inp.style.display = 'none'; // Oculta o campo de sugestões após a seleção de uma sugestão
                });
                addressSuggestions.appendChild(li);
            });
        }).catch(error => {
            addressSuggestions.innerHTML = '<li>Erro ao buscar endereços. Tente novamente mais tarde.</li>';
            inp.style.display = 'none'; // Oculta o campo de sugestões em caso de erro na busca
        });
    });
    

    var routingControl;

    document.getElementById('locateButton').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                showRoute(position.coords.latitude, position.coords.longitude);
            }, function(error) {
                alert('Erro ao obter localização: ' + error.message);
            });
        } else {
            alert('Geolocalização não é suportada neste navegador.');
        }
    });

    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert("Usuário recusou a solicitação de Geolocalização.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Informações de localização não estão disponíveis.");
                break;
            case error.TIMEOUT:
                alert("A solicitação para obter a localização do usuário expirou.");
                break;
            case error.UNKNOWN_ERROR:
                alert("Ocorreu um erro desconhecido.");
                break;
        }
    }

    console.log(window.innerWidth);

    // Ou para atualizar e mostrar a largura da janela dinamicamente ao redimensioná-la:
    window.addEventListener('resize', function() {
        console.log(window.innerWidth);
    });
    
        adjustSuggestionsPosition();
        window.addEventListener('resize', adjustSuggestionsPosition);
    
    function adjustSuggestionsPosition() {
        const width = window.innerWidth;
        const addressSuggestions = document.getElementById('addressSuggestions');
        const mapadesc = document.getElementById('mapadesc');
        const corpo = document.querySelector('.corpo'); // Certifique-se de que este seletor identifique corretamente o contêiner pai original de addressSuggestions
    
        // Verifica se está abaixo ou acima de 768px para ajustar a posição de addressSuggestions
        if (width <= 505) {
            // Para telas menores ou iguais a 768px, move addressSuggestions para dentro de mapadesc
            mapadesc.insertBefore(addressSuggestions, mapadesc.children[1]);
        } else {
            // Para telas maiores que 768px, move addressSuggestions de volta para sua posição original fora de mapadesc
            mapa.insertBefore(addressSuggestions, document.getElementById('mapid'));
        }
    }
    
    function reorderElements() {
        const avaliacaoContainers = document.querySelectorAll('.avaliacao-container .medico-info');
    
        avaliacaoContainers.forEach(container => {
            const doct = container.querySelector('.doct, .doct2');
            const avaliacaoDetails = container.querySelector('.avaliacao-details');
            const paragraphs = avaliacaoDetails.querySelectorAll('p:not(.nota-maxima), .nota-maxima'); // Seleciona os <p> dentro de .avaliacao-details
            const stars = avaliacaoDetails.querySelectorAll('.rating-stars');

            if (window.innerWidth <= 615) {
                // Move o .doct ou .doct2 para ser o primeiro elemento da .avaliacao-details
                avaliacaoDetails.insertBefore(doct, avaliacaoDetails.firstChild);
                // Move os <p> para seguir o .doct ou .doct2
                paragraphs.forEach(p => avaliacaoDetails.insertBefore(p, stars.nextSibling));
            } else {
                // Para telas maiores, devolve o .doct ou .doct2 e os <p> para suas posições originais
                container.insertBefore(doct, avaliacaoDetails);
                // inserido no final
                paragraphs.forEach(p => avaliacaoDetails.appendChild(p));
            }
        });
    }
    
    window.addEventListener('resize', reorderElements);
    
    reorderElements();
    