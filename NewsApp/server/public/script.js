// JavaScript for handling the process button click, showing the spinner, and displaying images after a delay
// Connect to Socket.IO

const imageContainerDiv = document.getElementById('imageContainer');
document.getElementById("processBtn").addEventListener("click", async function() {
    const fileInput = document.getElementById("fileInput");
    const fileInfoDiv = document.getElementById("fileInfo");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const progressInfoDiv = document.getElementById('progressInfo');
    // Check if a file is selected
    if (fileInput.files.length === 0) {
        fileInfoDiv.innerHTML = "<span class='text-danger'>Please select a file first.</span>";
        return;
    }

    // Show the loading spinner
    loadingSpinner.classList.remove("d-none");
    progressInfoDiv.classList.remove("d-none");
    // Hide the image grid initially

    const socket = io();

    // Listen for progress updates from the server
    socket.on('progress', function(data) {
    progressInfoDiv.innerHTML = `<center><strong>Processed Pages ${data.imageCount} ...</strong></center>`;
    loadImageInGallery(data);
    console.log(data);

    });
    //send a post call
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    // Make the POST request to the server
    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Hide the loading spinner
        loadingSpinner.classList.add('d-none');
        progressInfoDiv.classList.add('d-none');
        // Display file upload details
        fileInfoDiv.innerHTML = `
          <p><strong>File uploaded successfully!</strong></p>
          <p><strong>File Name:</strong> ${data.file.originalname}</p>
        `;
      })
    .catch(error => {
        loadingSpinner.classList.add('d-none');
        fileInfoDiv.innerHTML = `<span class='text-danger'>Error uploading file: ${error.message}</span>`;
    });
});

function loadImageInGallery(data)
{
    var AddImage = `
    <div class="col">
        <div class="card">
            <img src="/images/${data.imageName}" class="card-img-top" alt="${data.imageCount}">
            <div class="card-body">
            <h5 class="card-title">Page ${data.imageCount}</h5>
            <center><button type="button" class="btn btn-primary" id="ParseText">Parse Text</button></center>
            </div>
        </div>
    </div>
    `
    imageContainerDiv.innerHTML+=AddImage;
}

//loadImageInGallery({imageName:"page1.png",imageCount:1});