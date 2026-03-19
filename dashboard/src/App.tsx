import './index.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, CheckCircle2, AlertCircle } from 'lucide-react';

interface ParsedData {
  extractedName?: string;
  product?: string;
  price?: number;
  priority?: 'urgent' | 'normal';
}

interface JobPayload {
  message: string;
  parsed?: ParsedData;
  reply?: string;
}

interface Job {
  id: number;
  pipelineId: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payload: JobPayload;
  createdAt: string;
}

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get<Job[]>('http://localhost:3000/jobs');
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs", err);
      }
    };

    fetchJobs();

    const interval = setInterval(() => {
      fetchJobs();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Embroidery Automation Dashboard</h1>
        <p className="text-gray-600">Real-time pipeline monitoring</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Activity size={24} /></div>
          <div><p className="text-sm text-gray-500">Total Jobs</p><p className="text-2xl font-bold">{jobs.length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 size={24} /></div>
          <div><p className="text-sm text-gray-500">Completed</p><p className="text-2xl font-bold">{jobs.filter(j => j.status === 'completed').length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><AlertCircle size={24} /></div>
          <div><p className="text-sm text-gray-500">Failed</p><p className="text-2xl font-bold">{jobs.filter(j => j.status === 'failed').length}</p></div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-sm md:text-base">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-700">ID</th>
              <th className="p-4 font-semibold text-gray-700">Customer</th>
              <th className="p-4 font-semibold text-gray-700">Product</th>
              <th className="p-4 font-semibold text-gray-700">Price</th>
              <th className="p-4 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="p-4 text-gray-600">#{job.id}</td>
                <td className="p-4 font-medium text-gray-900">
                  {job.payload.parsed?.extractedName || 'Waiting...'}
                </td>
                <td className="p-4 text-gray-600">
                  {job.payload.parsed?.product || 'Custom'}
                </td>
                <td className="p-4 text-emerald-600 font-bold">
                  {job.payload.parsed?.price ? `${job.payload.parsed.price} ₪` : '-'}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${job.status === 'completed' ? 'bg-green-100 text-green-700' :
                    job.status === 'failed' ? 'bg-red-100 text-red-700' :
                      job.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {job.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;