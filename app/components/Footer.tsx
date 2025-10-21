function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-10 mt-5">
      <div className="max-container flex items-center justify-center">
        <p>© {year} BookWise.co. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
