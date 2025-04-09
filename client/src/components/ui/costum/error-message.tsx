export const ErrorMessage = ({ message }: { message: string }) => (
    <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
      {message}
    </div>
  );