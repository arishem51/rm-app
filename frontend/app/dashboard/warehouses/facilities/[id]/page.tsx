const Page = async (params: Promise<{ id: number }>) => {
  const id = (await params).id;
  return <div>Detail page {id} </div>;
};

export default Page;
