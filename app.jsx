// App shell

function App() {
  const route = useHashRoute();
  let page;
  if (route.page === "author") page = <AuthorPage authorId={route.authorId} />;
  else if (route.page === "all-works") page = <AllWorksPage />;
  else page = <HomePage />;

  return (
    <div className="grain">
      <Nav route={route} />
      {page}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
