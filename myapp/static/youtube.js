$(document).ready(function(){
    let API_KEY = process.env.YOUTUBE_API

    $("form").submit((e) => {
        e.preventDefault()
        $("#videos").empty();
        let searchitem = $("#search").val()
        videoSearch(API_KEY, searchitem, 20) 
    })

    $(document).bind('click', event => {
        
        const element = event.target;

        console.log(element)
        if (element.id.startsWith('post_content_') || element.id.startsWith('entirediv_') || element.id.startsWith('title_')){
  
            testing = document.querySelector("#postvideo").innerHTML
            console.log(testing)
            
            console.log("clicked!")
            const searchitem = document.querySelector("#search");
            searchitem.style.display = "none";
            const searchbutton = document.querySelector("#searchbutton");
            searchbutton.style.display = "none";

            const videoid = element.dataset.id;
            console.log(videoid)

            const postcontentElement = document.querySelector(`#title_${videoid}`);
            const postcontent = postcontentElement.parentNode.innerHTML;
            const youtubetitle = postcontentElement.innerHTML;
            const channelName = document.querySelector(`#channelname_${videoid}`).innerHTML;

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
            iframe.srcdoc = `<style>img { width: 100%; height: auto; }</style><img src="${imgSrc}" alt="">`;
            iframe.style.width = `${imgWidth}px`;
            iframe.style.height = `${imgHeight}px`;
            
            iframe.addEventListener('mouseenter', () => {
                iframe.style.opacity = '0.8';
            });
    
            iframe.addEventListener('mouseleave', () => {
                iframe.style.opacity = '1';
            });

            const inputvideoid = document.createElement("input");
            inputvideoid.type = "hidden";
            inputvideoid.name = "videoid";
            inputvideoid.value = videoid;

            console.log(inputvideoid)
         
            const input2 = document.createElement("input");
            input2.type = "hidden";
            input2.name = "thumbnail";
            input2.value = `${imgSrc}`;

            const input3 = document.createElement("input");
            input3.type = "hidden";
            input3.name = "videotitle";
            input3.value = `${youtubetitle}`;

            const input4 = document.createElement("input");
            input4.type = "hidden";
            input4.name = "channel";
            input4.value = `${channelName}`;

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
            tinydiv.innerHTML = `${youtubetitle}`;
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

            
            const formactionurl = "/makepostyoutube";
            const form = document.createElement("form");
            form.style.display = "flex";
            form.method="post";
            form.action= formactionurl;


            form.appendChild(iframe);
            form.appendChild(anotherdiv);
            form.appendChild(input2);
            form.appendChild(input3);
            form.appendChild(input4);
            form.appendChild(inputvideoid);


            document.querySelector("#postvideo").appendChild(form);
            console.log(iframe.srcdoc)
            };

            


        }

    })

})

function videoSearch(apikey, search, maxResults){

    fetch(`https://www.googleapis.com/youtube/v3/search?key=${apikey}&part=snippet&maxResults=${maxResults}&type=video&q=${search}`)

    .then(response => response.json())
    .then(data => {
        
        
        data.items.forEach(item => {
            console.log(item)
            let content = ''
            content = 

            `

                <li class="li-data-list">
                <div>
                    <img class="card-img-top" i style="width: 110px; height:auto" id=post_content_${item.id.videoId} data-id=${item.id.videoId} src="${item.snippet.thumbnails.high.url}" alt="${item.snippet.title}">
                </div>
                    <div class="card-body">
                            <h4 class="card-title-search" data-id=${item.id.videoId} id=title_${item.id.videoId}>${item.snippet.title}</h5>
                            <h4 class="card-title-search" id=channelname_${item.id.videoId}>${item.snippet.channelTitle}</h6>
                    </div>
                </div>

            
            `  
   

            $("#videos").append(content)

        });

        })
    }
