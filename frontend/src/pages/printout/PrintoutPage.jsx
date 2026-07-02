import { useState } from 'react'
import { createPrintJob } from '../../services/printout.service'
import { useNavigate } from 'react-router-dom'
import { addToCart } from '../../services/cart.service'
import { toast } from "react-toastify";

function PrintoutPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [pageCount, setPageCount] = useState(1)
  const [copies, setCopies] = useState(1)
  const [color, setColor] = useState(false)
  const [doubleSided, setDoubleSided] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedFile) {
      toast.error('Please select a file')
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()

      formData.append('file', selectedFile)
      formData.append('pageCount', pageCount)
      formData.append('copies', copies)
      formData.append('color', color)
      formData.append('double_sided', doubleSided)

      const response = await createPrintJob(formData)
      await addToCart(
  response.data.id,
  1,
  'printout'
)
toast.success('Print job added to cart successfully!')

navigate('/cart')

      setSelectedFile(null)
      setPageCount(1)
      setCopies(1)
      setColor(false)
      setDoubleSided(false)

      document.getElementById('print-file').value = ''
    } catch (error) {
      console.error(error.response?.data || error.message)
      toast.error(
        error.response?.data?.error?.message ||
        'Failed to create print job'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100 py-10 px-4">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-xl">

        <h1 className="mb-8 text-3xl font-bold">
          Printout Service
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="mb-2 block font-semibold">
              Select File
            </label>

            <input
              id="print-file"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Number of Pages
            </label>

            <input
              type="number"
              min="1"
              value={pageCount}
              onChange={(e) => setPageCount(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Copies
            </label>

            <input
              type="number"
              min="1"
              value={copies}
              onChange={(e) => setCopies(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div className="flex gap-8">

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={color}
                onChange={(e) => setColor(e.target.checked)}
              />
              Color Print
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={doubleSided}
                onChange={(e) => setDoubleSided(e.target.checked)}
              />
              Double Sided
            </label>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Create Print Job'}
          </button>

        </form>

      </div>
    </div>
  )
}

export default PrintoutPage