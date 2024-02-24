export default function Tag(props) {

  return (
    <button
      className="btn m-2 btn-tag text-light fw-bold"
      style={{ backgroundColor: props.color }}
      onClick={() => {
        props.onClick(props.name);
        setIsClicked(true);
      }} // '()=>' to make sure this function will run only when the button is clicked
    >
      {props.name}
      {/* {!props.isLoaded && (
        <div class="spinner-border spinner-border-sm ms-2" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      )} */}
    </button>
  );
}
