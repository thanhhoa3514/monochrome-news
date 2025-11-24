import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, History, ChevronRight, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AiHistorySidebarProps {
    history: any[];
    isLoadingHistory: boolean;
    isHistoryOpen: boolean;
    setIsHistoryOpen: (isOpen: boolean) => void;
    currentGenerationId: string | null;
    loadFromHistory: (item: any) => void;
}

const AiHistorySidebar: React.FC<AiHistorySidebarProps> = ({
    history,
    isLoadingHistory,
    isHistoryOpen,
    setIsHistoryOpen,
    currentGenerationId,
    loadFromHistory
}) => {
    return (
        <div className={`w-80 flex-shrink-0 border-r bg-muted/10 transition-all duration-300 ${isHistoryOpen ? 'ml-0' : '-ml-80 hidden'}`}>
            <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                    <History className="w-4 h-4" />
                    History
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setIsHistoryOpen(false)}>
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="p-4 space-y-3">
                    {isLoadingHistory ? (
                        <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                    ) : history.map((item) => (
                        <div
                            key={item.id}
                            className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${currentGenerationId === item.id ? 'border-primary bg-primary/5' : 'border-transparent bg-card'}`}
                            onClick={() => loadFromHistory(item)}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <Badge variant="outline" className="text-xs">{item.category}</Badge>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.status === 'saved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {item.status}
                                </span>
                            </div>
                            <p className="text-sm font-medium line-clamp-2 mb-1">{item.prompt || 'No custom prompt'}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default AiHistorySidebar;
