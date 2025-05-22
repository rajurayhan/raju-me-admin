import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '../../icons';
import MDEditor from '@uiw/react-md-editor';
import { config } from '../../config';
import PageMeta from "../../components/common/PageMeta";

interface GenerateContentFormData {
  context: string;
  content: string;
  isPublished: boolean;
}

const GenerateContent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<GenerateContentFormData>({
    context: '',
    content: '',
    isPublished: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${config.apiBaseUrl}/ai-content/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          context: formData.context,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, content: data.content }));
        navigate('/blogs');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to generate content');
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

  const handleContentChange = (value?: string) => {
    setFormData(prev => ({ ...prev, content: value || '' }));
  };

  return (
    <>
      <PageMeta
        title="Generate AI Content | R A J U"
        description="Generate blog content using AI"
      />
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => navigate('/blogs')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Back to Blogs
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold mb-6">Generate AI Content</h1>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="context"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Context
              </label>
              <textarea
                id="context"
                name="context"
                value={formData.context}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your context for AI content generation"
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
                <span className="ml-2 text-sm text-gray-700">Publish immediately</span>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary px-6 py-2 rounded-lg shadow font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150"
              >
                {loading ? (
                  <span className="flex items-center"><span className="loader mr-2"></span>Generating...</span>
                ) : 'Generate Content'}
              </button>
            </div>
          </form>

          {formData.content && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Generated Content</h2>
              <div data-color-mode="light">
                <MDEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  height={400}
                  preview="edit"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GenerateContent; 