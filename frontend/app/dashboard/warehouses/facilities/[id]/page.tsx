const Page = async (params: Promise<{ id: number }>) => {
  const id = (await params).id;
  return <div>123</div>;
};

export default Page;
