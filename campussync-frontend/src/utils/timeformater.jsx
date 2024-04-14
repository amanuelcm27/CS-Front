const timeFormater = (isoDateString) => {
    const date = new Date(isoDateString);
    const formattedDate = date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric', 
    });
    return formattedDate;
  }
  export default timeFormater;