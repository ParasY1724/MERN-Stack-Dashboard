import React, { useState, useContext,useRef } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import JoditEditor from 'jodit-react';

const API_URL = import.meta.env.VITE_BACKEND_URL;

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [tags, setTags] = useState([]);
  const { user } = useContext(AuthContext);
  const editor = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to create a post');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('tags', JSON.stringify(tags));
      if (media) {
        formData.append('media', media);
      }

      const response = await fetch(`${API_URL}/feed/post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      console.log('New post created:', data);

      // Clear form fields after successful post creation
      setTitle('');
      setContent('');
      setMedia(null);
      setMediaPreview(null);
      setTags([]);


      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">TITLE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title..."
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">CONTENT</label>
              <JoditEditor
                ref={editor}
                value={content}
                onChange={newContent => setContent(newContent)}
              />
              <div className="text-right text-sm text-gray-500">{content.length}</div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">TAGS</label>
              <input 
                type="text" 
                placeholder="Add your Instagram Tags" 
                className="w-full p-2 border rounded-md mb-2"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                    {tag}
                    <button type='button' onClick={() => handleRemoveTag(tag)} className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-sm mr-2">Try:</span>
                {['Coding', 'Sports', 'Gaming'].map(tag => (
                  <button type='button' key={tag} onClick={() => handleAddTag(tag)} className="bg-orange-400 text-white rounded-full px-3 py-1 text-sm">+ {tag}</button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">ADD MEDIA</label>
              <input 
                type="file" 
                onChange={handleMediaUpload} 
                accept="image/*, video/*" 
                className="w-full p-2 border rounded-md"
              />
            </div>
            {mediaPreview && (
              <div className="mb-4">
                {media.type.startsWith('image/') ? (
                  <img src={mediaPreview} alt="Preview" className="w-full max-h-64 object-cover rounded" />
                ) : (
                  <video src={mediaPreview} controls className="w-full max-h-64 rounded" />
                )}
              </div>
            )}
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
              Publish
            </button>
          </form>
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
            {mediaPreview && (
              media.type.startsWith('image/') ? (
                <img src={mediaPreview} alt="Post" className="w-full h-64 object-cover rounded-md mb-2" />
              ) : (
                <video src={mediaPreview} controls className="w-full h-64 rounded-md mb-2" />
              )
            )}
    <div className="text-sm" dangerouslySetInnerHTML={{ __html: content }}></div>
    <div className="mt-2">
              {tags.map(tag => (
                <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;