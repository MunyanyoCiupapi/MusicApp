// beats.js
function showUploadForm() {
  document.getElementById('uploadForm').style.display = 'block';
}

async function loadBeats() {
  try {
    const meRes = await fetch('/me');
    const me = meRes.ok ? await meRes.json() : null;

    const res = await fetch('/beats');
    const beats = await res.json();

    const beatList = document.getElementById('beatList');
    beatList.innerHTML = ''; 

    beats.forEach(beat => {
      const beatCard = document.createElement('div');
      beatCard.classList.add('beat-card');

      beatCard.innerHTML = `
        <h3>${beat.title}</h3>
        <p>$${beat.price.toFixed(2)}</p>
        <audio controls src="/${beat.audioPath}"></audio>
        <button class="register-btn">Add to Cart</button>
        ${
          me && beat.ownerId === me.userId
            ? `<button class="delete-btn" data-id="${beat._id.toString()}">Delete</button>`
            : ''
        }
      `;

      beatList.appendChild(beatCard);
    });

  } catch (err) {
    console.error('Error loading beats:', err);
  }
}


document.addEventListener('click', async function (e) {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.getAttribute('data-id');

    const confirmed = confirm('Are you sure you want to delete this beat?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/delete/${id}`, {
        method: 'DELETE'
      });

      const result = await res.json();
      alert(result.message);

      if (res.ok) loadBeats(); 
    } catch (err) {
      console.error('Error deleting beat:', err);
      alert('Failed to delete beat.');
    }
  }
});

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
      await loadBeats(); 
    } else {
      alert("Upload failed: " + result.message);
    }
  } catch (err) {
    console.error('Upload error:', err);
    alert("Error uploading beat: " + err.message);
  }
});

window.onload = loadBeats;
