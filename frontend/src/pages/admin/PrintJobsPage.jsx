import { useEffect, useState } from "react";
import {
  getAllPrintJobs,
  updatePrintJobStatus,
} from "../../services/printout.service";

const statuses = [
  "pending",
  "printing",
  "ready",
  "completed",
];

const PrintJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await getAllPrintJobs();
      setJobs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatus = async (job, status) => {
    try {
      await updatePrintJobStatus(job.id, status);
      loadJobs();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Unable to update status."
      );
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const text = search.toLowerCase();

    return (
      job.file_name.toLowerCase().includes(text) ||
      job.user_name?.toLowerCase().includes(text)
    );
  });

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Print Job Management
        </h1>

      </div>

      <input
        placeholder="Search..."
        className="border rounded p-2 mb-6 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full bg-white rounded shadow">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-3 text-left">
              Student
            </th>

            <th className="p-3 text-left">
              File
            </th>

            <th className="p-3 text-left">
              Pages
            </th>

            <th className="p-3 text-left">
              Price
            </th>

            <th className="p-3 text-left">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {filteredJobs.map((job) => (

            <tr
              key={job.id}
              className="border-t"
            >

              <td className="p-3">
                {job.user_name}
              </td>

              <td className="p-3">
                {job.file_name}
              </td>

              <td className="p-3">
                {job.page_count}
              </td>

              <td className="p-3">
                ₹{job.calculated_price}
              </td>

              <td className="p-3">

                <select
                  value={job.status}
                  onChange={(e) =>
                    handleStatus(
                      job,
                      e.target.value
                    )
                  }
                  className="border rounded p-2"
                >

                  {statuses.map((status) => (

                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>

                  ))}

                </select>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default PrintJobsPage;