$(document).ready(function() {
    // show the loading spinner or message when the form is submitted
    $("form").submit(e => {
      e.preventDefault();
      $("#videos").empty();
      $("#loading-spinner").show(); // show the loading spinner
      $("#loading-message").show(); // show the loading message
      let search = $("#search").val();
      getToken().then(accessToken => gettrack(accessToken, search));
    })

    $(document).bind('click', event => {
        
      const element = event.target;

      console.log(element)
      if (element.id.startsWith('post_content_') || element.id.startsWith('entirediv_') || element.id.startsWith('songtitle_')){

          testing = document.querySelector("#postvideo").innerHTML
          console.log(testing)
          
          console.log("clicked!")
          /* const searchitem = document.querySelector("#search");
          searchitem.style.display = "none";
          const searchbutton = document.querySelector("#searchbutton");
          searchbutton.style.display = "none";*/

          const videoid = element.dataset.id;
          console.log(videoid)

          const postcontentElement = document.querySelector(`#songtitle_${videoid}`);
          const postcontent = postcontentElement.parentNode.innerHTML;
          const songtitle = postcontentElement.innerHTML;
          const artistName = document.querySelector(`#artist_${videoid}`).innerHTML;
          const albumName = document.querySelector(`#album_${videoid}`).innerHTML;


          const imgElement = document.querySelector(`#post_content_${videoid}`);
          const imgSrc = imgElement.src;
          console.log(imgSrc)

          const image = new Image();
          image.src = imgSrc;

          image.onload = function() {
          const imgWidth = image.width * 0.75;
          const imgHeight = image.height * 0.75;

          const iframe = document.createElement("iframe");
          iframe.id = `iframe_${videoid}`;
          iframe.className = 'form-control formwidth';
          iframe.srcdoc = `<style>img { width: 230px; height: 230px; }</style><img src="${imgSrc}" alt="">`;
          iframe.style.width = `280px`;
          iframe.style.height = `280px`;
          
          iframe.addEventListener('mouseenter', () => {
              iframe.style.opacity = '0.8';
          });
  
          iframe.addEventListener('mouseleave', () => {
              iframe.style.opacity = '1';
          });

       
          const input2 = document.createElement("input");
          input2.type = "hidden";
          input2.name = "thumbnail";
          input2.value = `${imgSrc}`;

          const input3 = document.createElement("input");
          input3.type = "hidden";
          input3.name = "songtitle";
          input3.value = `${songtitle}`;

          const input4 = document.createElement("input");
          input4.type = "hidden";
          input4.name = "album";
          input4.value = `${albumName}`;

          const input5 = document.createElement("input");
          input5.type = "hidden";
          input5.name = "artist";
          input5.value = `${artistName}`;

          const songpreview1 = document.querySelector(`#songpreview_${videoid}`);
          const songpreview = songpreview1.src;

          const input6 = document.createElement("input");
          input6.type = "hidden";
          input6.name = "songpreview";
          input6.value = `${songpreview}`;

          const textarea = document.createElement("textarea");
          textarea.id = `textarea_${videoid}`;
          textarea.className = 'form-control formwidth';
          textarea.name="impressions";
          textarea.style.display = 'inline-block';
          textarea.style.height = "65%";
          textarea.setAttribute('autofocus', '');

          const postbutton = document.createElement("div");
          postbutton.style.height = "10%";
          
      
          const button = document.createElement("button");
          button.textContent = "Post";
          button.className= "btn btn-primary"
          button.onclick = function() {
            form.submit();
          };

          postbutton.appendChild(button)
          


          const tinydiv = document.createElement('div');
          tinydiv.style.backgroundColor = '#fff333';
          tinydiv.style.borderRadius = '5px';
          tinydiv.style.padding = '20px';
          tinydiv.style.textAlign = 'center';
          tinydiv.style.display = 'inline-block';
          tinydiv.innerHTML = `${songtitle}`;
          tinydiv.style.height = "25%";
          tinydiv.addEventListener('mouseenter', () => {
          tinydiv.style.opacity = '0.8';
          });

          tinydiv.addEventListener('mouseleave', () => {
          tinydiv.style.opacity = '1';
          });

          const anotherdiv = document.createElement("div");
          anotherdiv.style.display = "flex";
          anotherdiv.style.flexDirection = "column";
          anotherdiv.appendChild(tinydiv);
          anotherdiv.appendChild(textarea);
          anotherdiv.appendChild(postbutton);
          anotherdiv.style.width= "100%";

          
          const formactionurl = "/makepostmusic";
          const form = document.createElement("form");
          form.style.display = "flex";
          form.method="post";
          form.action= formactionurl;


          form.appendChild(iframe);
          form.appendChild(anotherdiv);
          form.appendChild(input2);
          form.appendChild(input3);
          form.appendChild(input4);
          form.appendChild(input5);
          form.appendChild(input6);


          

          document.querySelector("#postvideo").appendChild(form);
          console.log(iframe.srcdoc)
          };


        }

    })
  })

  
function gettrack(access_token, search) {
    var accessToken = access_token;
    fetch(`https://api.spotify.com/v1/search?q=track:${search}&type=track&market=JP`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(data =>
        data.tracks.items.forEach(item => {
            console.log(item.preview_url);
            let thumbnailUrl = item.album.images[0].url; // get the thumbnail image URL
            let previewUrl = item.preview_url; // get the preview URL
            let content = `

            <li class="li-data-list">
            <div>
                <img class="card-img-top" i style="width: 120px; height: 120px"src="${thumbnailUrl}" id=post_content_${item.id} data-id=${item.id} alt="${item.name}">
            </div>
                <div class="card-body">
                    <h4 class="card-title-search" id=songtitle_${item.id} data-id=${item.id}>${item.name}</h4>
                    <h4 class="card-title-search" id=artist_${item.id} data-id=${item.id}>${item.artists[0].name}</h4>
                    <h4 class="card-title-search" id=album_${item.id} data-id=${item.id}>${item.album.name}</h4>
                    <audio class="audio-player" id=songpreview_${item.id} data-id=${item.id} src="${previewUrl}" controls=true></audio>
                </div>
            </div>`

            $("#videos").append(content);

        })
      )
      .catch(error => console.error(error))
      .finally(() => {
        // hide the loading spinner and message once the data has been loaded
        $("#loading-spinner").hide();
        $("#loading-message").hide();
      });
  }
  
function getToken() {

    let authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
      },
      body: 'grant_type=client_credentials'
    };
  
    return fetch('https://accounts.spotify.com/api/token', authOptions)
      .then(response => response.json())
      .then(body => body.access_token)
      .catch(error => console.error(error));
  }
