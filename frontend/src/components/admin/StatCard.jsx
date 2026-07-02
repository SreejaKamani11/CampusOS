const colors = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  yellow: "bg-yellow-100 text-yellow-600",
  purple: "bg-purple-100 text-purple-600",
};

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center">

      <div>
        <p className="text-gray-500 text-sm">
          {title}
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {value}
        </h2>
      </div>

      <div
        className={`p-4 rounded-full text-2xl ${colors[color]}`}
      >
        {icon}
      </div>

    </div>
  );
};

export default StatCard;