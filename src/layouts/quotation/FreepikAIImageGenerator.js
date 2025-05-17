import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import React, { useState } from 'react';

const FreepikAIImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = async () => {
    setLoading(true);
    setError(null);
    setImages([]);

    const options = {
      method: 'POST',
      headers: {
        'x-freepik-api-key': 'FPSX6fb14b5c917c4ba5a9f150a5184bc728',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        image: { size: 'square_1_1' },
        num_images:2
      })
    };

    try {
      const response = await fetch('https://api.freepik.com/v1/ai/text-to-image', options);
      const data = await response.json();
      if (data.data) {
        setImages(data.data.map(img => `data:image/png;base64,${img.base64}`));
      } else {
        setError('Failed to generate image.');
      }
    } catch (err) {
      setError('An error occurred while generating the image.');
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Freepik AI Image Generator</h1>
        <input
          type="text"
          className="border p-2 w-full mb-4"
          placeholder="Enter a prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={generateImage}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {images.map((src, index) => (
            <img key={index} src={src} alt="Generated" className="w-full" />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FreepikAIImageGenerator;
