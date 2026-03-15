'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { BlurCard } from '@/components/blur-card';
import { MarkdownEditor } from '@/components/markdown-editor';
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

export default function MarkdownEditorPage() {
    const t = useTranslations('MarkdownEditor');
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
                    <div className='flex items-center gap-2 px-4'>
                        <SidebarTrigger className='-ml-1' />
                        <Separator
                            orientation='vertical'
                            className='mr-2 data-vertical:h-4 data-vertical:self-auto'
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className='hidden md:block'>
                                    <BreadcrumbLink href='#'>{t('breadcrumb1')}</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className='hidden md:block' />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{t('breadcrumb2')}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className='grid auto-rows-min gap-4 md:grid-cols-3 p-4'>
                    <div className='col-span-3'>
                        <BlurCard title={t('title')} subTitle={t('subTitle')}>
                            <MarkdownEditor />
                        </BlurCard>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
