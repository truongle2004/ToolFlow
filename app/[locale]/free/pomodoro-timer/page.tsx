'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { BlurCard } from '@/components/blur-card';
import PomodoroTimer from '@/components/pomodoro-timer';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useTranslations } from 'next-intl';

export default function PomodoroTimerPage() {
  const t = useTranslations('PomodoroTimer');

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator
              orientation='vertical'
              className='mr-2 data-vertical:h-4 data-vertical:self-auto'
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink
                    href='#'
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {t('breadcrumb1')}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage className='text-foreground font-medium text-sm'>
                    {t('breadcrumb2')}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <BlurCard title={t('title')} subTitle={t('subTitle')}>
          <PomodoroTimer />
        </BlurCard>
      </SidebarInset>
    </SidebarProvider>
  );
}
