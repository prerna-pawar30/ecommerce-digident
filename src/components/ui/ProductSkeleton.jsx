const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full aspect-square bg-gray-200 rounded-xl mb-4"></div>
      
      {/* Title Placeholder */}
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      
      {/* Price & Button Placeholder */}
      <div className="flex justify-between items-center mt-auto">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;