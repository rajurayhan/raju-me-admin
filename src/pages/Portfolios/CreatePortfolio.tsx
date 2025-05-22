import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../../icons';
import MDEditor from '@uiw/react-md-editor';
import { config } from '../../config';
import PageMeta from "../../components/common/PageMeta";

interface CreatePortfolioFormData {
  title: string;
  description: string;
  image?: File;
  liveUrl: string;
  githubUrl: string;
  technologies: string;
  category: string;
  isPublished: boolean;
}

const CreatePortfolio = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreatePortfolioFormData>({
    title: '',
    description: '',
    liveUrl: '',
    githubUrl: '',
    technologies: '',
    category: '',
    isPublished: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      if (formData.liveUrl) formDataToSend.append('liveUrl', formData.liveUrl);
      if (formData.githubUrl) formDataToSend.append('githubUrl', formData.githubUrl);
      if (formData.technologies) {
        // Split by comma and trim whitespace
        const techArray = formData.technologies.split(',').map(t => t.trim()).filter(Boolean);
        techArray.forEach(t => formDataToSend.append('technologies', t));
      }
      if (formData.category) formDataToSend.append('category', formData.category);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      formDataToSend.append('isPublished', formData.isPublished.toString());

      console.log('Sending form data:', {
        title: formData.title,
        description: formData.description,
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl,
        technologies: formData.technologies,
        category: formData.category,
        hasImage: !!formData.image,
        imageName: formData.image?.name,
        isPublished: formData.isPublished
      });

      const response = await fetch(`${config.apiBaseUrl}/portfolio`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create portfolio');
      }

      const data = await response.json();
      console.log('Server response:', data);

      if (data.success) {
        navigate('/portfolios');
      } else {
        setError(data.message || 'Failed to create portfolio');
      }
    } catch (err) {
      console.error('Error creating portfolio:', err);
      setError(err instanceof Error ? err.message : 'Failed to create portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDescriptionChange = (value?: string) => {
    setFormData(prev => ({ ...prev, description: value || '' }));
  };

  return (
    <>
      <PageMeta
        title="Create Portfolio | R A J U"
        description="Create a new portfolio project"
      />
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => navigate('/portfolios')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Back to Portfolios
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold mb-6">Create Portfolio</h1>
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter project title"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Portfolio Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {previewUrl && (
                <div className="mt-2">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <div data-color-mode="light">
                <MDEditor
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  height={400}
                  preview="edit"
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="liveUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Portfolio Live URL
              </label>
              <input
                type="url"
                id="liveUrl"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="githubUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Portfolio GitHub URL
              </label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://github.com/username/repo"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="technologies"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Portfolio Technologies (comma separated)
              </label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="React, Node.js, TypeScript"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Web Development, Mobile App, etc."
              />
            </div>
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Publish Portfolio immediately</span>
              </label>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary px-6 py-2 rounded-lg shadow font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150"
              >
                {loading ? (
                  <span className="flex items-center"><span className="loader mr-2"></span>Creating...</span>
                ) : 'Create Portfolio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePortfolio; 