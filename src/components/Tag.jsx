export default function Tag(props) {
  return (
    <div className="col-6 col-md-3 col-xl-12">
      <button
        className="btn btn-tag text-dark shadow-sm tag fw-bold w-100 h-100"
        style={{ backgroundColor: props.color }}
        onClick={() => {
          props.onClick(props.name);
          setIsClicked(true);
        }} // '()=>' to make sure this function will run only when the button is clicked
      >
        {props.name}
      </button>
    </div>
  );
}
