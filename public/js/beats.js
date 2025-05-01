// beats.js

// Show upload form
function showUploadForm() {
  document.getElementById('uploadForm').style.display = 'block';
}

// Fetch and display beats from the backend
async function loadBeats() {
  try {
    const res = await fetch('/beats');
    const beats = await res.json();

    const beatList = document.getElementById('beatList');
    beatList.innerHTML = ''; // Clear current list

    beats.forEach(beat => {
      const beatCard = document.createElement('div');
      beatCard.classList.add('beat-card');
      beatCard.innerHTML = `
        <h3>${beat.title}</h3>
        <p>$${beat.price.toFixed(2)}</p>
        <audio controls src="/${beat.audioPath}"></audio>
        <button class="register-btn">Add to Cart</button>
      `;
      beatList.appendChild(beatCard);
    });
  } catch (err) {
    console.error('Error loading beats:', err);
  }
}

// Upload beat
document.getElementById('uploadForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  const file = document.getElementById('beatUpload').files[0];

  if (!title || !price || !file) {
    alert("Please fill out all fields.");
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('price', price);
  formData.append('audio', file);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      alert('Beat uploaded successfully!');
      document.getElementById('uploadForm').reset();
      document.getElementById('uploadForm').style.display = 'none';
      await loadBeats(); // refresh the beat list
    } else {
      alert("Upload failed: " + result.message);
    }
  } catch (err) {
    console.error('Upload error:', err);
    alert("Error uploading beat: " + err.message);
  }
});

// Load beats on page load
window.onload = loadBeats;
