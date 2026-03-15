interface BlurCardProps {
  children: React.ReactNode;
  title: string;
  subTitle: string;
}

export function BlurCard({ children, title, subTitle }: BlurCardProps) {
  return (
    <div className='flex flex-1 flex-col gap-6 p-8 pt-6 w-full min-h-screen'>
      <div className='flex flex-col gap-6 h-full'>
        <div className='flex flex-col gap-1'>
          <h1
            className='text-3xl font-semibold tracking-tight text-foreground'
            style={{ fontFamily: "'Lora', serif" }}
          >
            {title}
          </h1>
          <p className='text-sm text-muted-foreground'>{subTitle}</p>
        </div>

        <div className='flex flex-col w-full flex-1 bg-card text-card-foreground border border-border rounded-3xl p-6 sm:p-10'>
          {children}
        </div>
      </div>
    </div>
  );
}
