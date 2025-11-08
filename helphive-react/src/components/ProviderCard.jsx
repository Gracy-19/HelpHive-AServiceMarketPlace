import { Link } from 'react-router-dom';

const ProviderCard = ({ provider }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <img src={provider.image} alt={provider.name} className="w-20 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-indigo-700 mb-2">{provider.name}</h3>
      <p className="text-sm text-gray-600 mb-1">Service: {provider.service}</p>
      <p className="text-sm text-gray-600 mb-1">Location: {provider.location}</p>
      <p className="text-sm text-yellow-500 mb-4">⭐ {provider.rating} ({provider.reviews} reviews)</p>
      <Link to={`/provider/${provider.id}`} className="text-indigo-600 font-medium hover:underline">
        View Profile →
      </Link>
    </div>
  );
};
export default ProviderCard;