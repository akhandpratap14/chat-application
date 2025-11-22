export default function Avatar({ name } : any) {
  return (
    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
      {name[0]}
    </div>
  );
}
