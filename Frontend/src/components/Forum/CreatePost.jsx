import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const API_URL = 'http://localhost:8080'; // Replace with your actual API URL

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to create a post');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // formData.append('tags', JSON.stringify(tags));
      // if (image) {
      //   formData.append('image', image);
      // }

      
      const response = await fetch(`${API_URL}/feed/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title : title, content : content })
        
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      console.log('New post created:', data);

      // Clear form fields after successful post creation
      setTitle('');
      setContent('');
      setTags([]);
      setImage(null);

      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleAddTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <div className="flex justify-between">
        <div className="w-1/2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">New Post</h2>
          <div className="flex items-center mb-4">
            <img src={user.profilePic} alt={user.username} className="w-10 h-10 rounded-full mr-2" />
            <span className="font-semibold">{user.username}</span>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">TITLE</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">CONTENT</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Transform your skincare routine into a self-care ritual..."
              className="w-full p-2 border rounded-md"
              rows="10"
            />
            <div className="text-right text-sm text-gray-500">{content.length}</div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">TAGS</label>
            <input type="text" placeholder="Add your Instagram Tags" className="w-full p-2 border rounded-md mb-2" />
            <div className="flex flex-wrap gap-2">
              <span className="text-sm mr-2">Try:</span>
              {['LoveYourSkin', 'GlowGoals', 'BeautyEssentials'].map(tag => (
                <button key={tag} onClick={() => handleAddTag(tag)} className="bg-orange-400 text-white rounded-full px-3 py-1 text-sm">+ {tag}</button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">ADD IMAGES</label>
            <div className="flex items-center space-x-2">
              {image && <img src={typeof image === 'string' ? image : URL.createObjectURL(image)} alt="Preview" className="w-24 h-24 object-cover rounded" />}
              <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer">
                <input type="file" onChange={handleImageUpload} accept="image/*" className="hidden" />
                <span className="text-4xl text-gray-400">+</span>
              </label>
            </div>
          </div>
          <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">Publish</button>
        </div>
        <div className="w-1/2 bg-white rounded-lg shadow-md p-6 ml-6">
          <h2 className="text-2xl font-bold mb-4">Preview</h2>
          <p className="text-sm text-gray-600 mb-2">Preview shows how your content will look when published.</p>
          <p className="text-sm text-gray-600 mb-2">Social network updates may alter its final appearance.</p>
          <div className="mt-4 border rounded-md p-4">
            <div className="flex items-center mb-2">
              <img src={user.profilePic} alt={user.username} className="w-8 h-8 rounded-full mr-2" />
              <span className="font-semibold">{user.username}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {image && <img src={typeof image === 'string' ? image : URL.createObjectURL(image)} alt="Post" className="w-full h-64 object-cover rounded-md mb-2" />}
            <p className="text-sm">{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;