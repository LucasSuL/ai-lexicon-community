export default function Tag({ name, color, onClick }) {
  return (
    <div className="col-6 col-md-3 col-xl-12">
      <button
        className="btn btn-tag text-dark shadow-sm tag fw-bold w-100 h-100"
        style={{ backgroundColor: color }}
        // '()=>' to make sure this function will run only when the button is clicked
        onClick={() => {
          onClick(name);
        }}
      >
        {name}
      </button>
    </div>
  );
}
