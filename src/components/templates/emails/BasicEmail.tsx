export default function BasicEmail({ content = 'Hello world' }: {
    content: string;
  }) {
    return <div>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  };