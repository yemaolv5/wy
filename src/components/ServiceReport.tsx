import React, { useState, useRef } from 'react';
import { Camera, Plus, Trash2, Download, LayoutGrid, Image as ImageIcon, User, MapPin, FileText, CheckSquare, ListTodo, Phone, X, ChevronDown, ChevronUp } from 'lucide-react';
import { ServiceRecord, ReportFrequency, PosterData } from '../types';
import { cn } from '../utils';
import html2canvas from 'html2canvas';

const CATEGORIES = [
  { id: 'customer', label: '客服篇', title: '心悦服务之客服篇', color: 'bg-purple-500', icon: '💁' },
  { id: 'cleaning', label: '保洁篇', title: '心悦服务之保洁篇', color: 'bg-emerald-500', icon: '🧹' },
  { id: 'greening', label: '绿化篇', title: '心悦服务之绿化篇', color: 'bg-green-500', icon: '🌳' },
  { id: 'security', label: '秩序篇', title: '心悦服务之秩序篇', color: 'bg-blue-500', icon: '👮' },
  { id: 'maintenance', label: '工程篇', title: '心悦服务之工程篇', color: 'bg-orange-500', icon: '🔧' },
];

export default function ServiceReport() {
  const [posterData, setPosterData] = useState<PosterData>({
    projectName: '微云·理想小区',
    reportTitle: '心悦周报',
    slogan: '您的5分满意，是我们的无限动力',
    dateRange: '2026年3月第2周',
    mainWork: ['巡查空置房及装修进度。', '节日氛围装饰。', '组织保洁团队开展节前大扫除。', '业主日常服务需求。'],
    nextWeekPlan: [
      '配合春季氛围布置现场秩序维护，做好物资搬运协助。',
      '开展节前园区全面清洁消杀，重点覆盖楼道、电梯、大厅、垃圾桶周边。',
      '开展节前园区安全大排查，重点整治楼道堆物、消防隐患、违规停放。'
    ],
    contactPhone: '0477-5189911',
    categoryPhotos: {
      customer: [],
      cleaning: [],
      greening: [],
      security: [],
      maintenance: [],
    }
  });

  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePhotoUpload = (category: string, index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotos = [...(posterData.categoryPhotos[category] || [])];
        newPhotos[index] = reader.result as string;
        setPosterData(prev => ({
          ...prev,
          categoryPhotos: {
            ...prev.categoryPhotos,
            [category]: newPhotos
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (category: string, index: number) => {
    const newPhotos = [...(posterData.categoryPhotos[category] || [])];
    newPhotos.splice(index, 1);
    setPosterData(prev => ({
      ...prev,
      categoryPhotos: {
        ...prev.categoryPhotos,
        [category]: newPhotos
      }
    }));
  };

  const handleExport = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#e11d48', // Match the red theme background
      });
      const link = document.createElement('a');
      link.download = `${posterData.projectName}-${posterData.reportTitle}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  const updateField = (field: keyof PosterData, value: any) => {
    setPosterData(prev => ({ ...prev, [field]: value }));
  };

  const updateListItem = (field: 'mainWork' | 'nextWeekPlan', index: number, value: string) => {
    const newList = [...posterData[field]];
    newList[index] = value;
    updateField(field, newList);
  };

  const addListItem = (field: 'mainWork' | 'nextWeekPlan') => {
    updateField(field, [...posterData[field], '']);
  };

  const removeListItem = (field: 'mainWork' | 'nextWeekPlan', index: number) => {
    const newList = [...posterData[field]];
    newList.splice(index, 1);
    updateField(field, newList);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">专业服务汇报海报</h2>
          <p className="text-slate-500">点击照片槽位直接上传，生成如示例般精美的物业周报</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 disabled:opacity-50"
        >
          <Download className={cn("w-5 h-5", isExporting && "animate-bounce")} />
          {isExporting ? "正在生成..." : "导出高清海报"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Editor */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2 border-b pb-3">
              <FileText className="w-5 h-5 text-rose-500" />
              基础信息编辑
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">项目名称</label>
                <input 
                  type="text" 
                  value={posterData.projectName}
                  onChange={e => updateField('projectName', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">报表标题</label>
                <input 
                  type="text" 
                  value={posterData.reportTitle}
                  onChange={e => updateField('reportTitle', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">日期范围</label>
                <input 
                  type="text" 
                  value={posterData.dateRange}
                  onChange={e => updateField('dateRange', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500/20 outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-500 uppercase">本周主要工作</label>
                <button onClick={() => addListItem('mainWork')} className="text-rose-500 hover:text-rose-600">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {posterData.mainWork.map((work, idx) => (
                <div key={idx} className="flex gap-2">
                  <input 
                    type="text" 
                    value={work}
                    onChange={e => updateListItem('mainWork', idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 outline-none"
                  />
                  <button onClick={() => removeListItem('mainWork', idx)} className="text-slate-300 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-500 uppercase">下周工作计划</label>
                <button onClick={() => addListItem('nextWeekPlan')} className="text-rose-500 hover:text-rose-600">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {posterData.nextWeekPlan.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <textarea 
                    value={item}
                    onChange={e => updateListItem('nextWeekPlan', idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 outline-none min-h-[60px]"
                  />
                  <button onClick={() => removeListItem('nextWeekPlan', idx)} className="text-slate-300 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">联系电话</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={posterData.contactPhone}
                  onChange={e => updateField('contactPhone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Poster Preview */}
        <div className="lg:col-span-8 flex justify-center">
          <div 
            ref={reportRef}
            className="w-[600px] bg-rose-600 p-0 shadow-2xl overflow-hidden flex flex-col items-center"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {/* Header */}
            <div className="w-full bg-white px-8 py-10 flex flex-col items-center relative">
              {/* Logo Placeholder */}
              <div className="absolute left-8 top-8 flex items-center gap-2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-rose-100">
                  <img 
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwZWE1ZTk7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2Y5NzMxNjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxwYXRoIGQ9Ik0xMCA0MCBMNTAgMTAgTDkwIDQwIEw5MCA5MCBMMTAgOTAgWiIgZmlsbD0idXJsKCNncmFkKSIgLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjQ1IiByPSIxMCIgZmlsbD0id2hpdGUiIC8+CiAgPHJlY3QgeD0iNDUiIHk9IjU1IiB3aWR0aD0iMTAiIGhlaWdodD0iMjUiIGZpbGw9IndoaXRlIiAvPgogIDxyZWN0IHg9IjU1IiB5PSI2NSIgd2lkdG09IjgiIGhlaWdodD0iNCIgZmlsbD0id2hpdGUiIC8+CiAgPHJlY3QgeD0iNTUiIHk9IjczIiB3aWR0aD0iOCIgaGVpZ2h0PSI0IiBmaWxsPSJ3aGl0ZSIgLz4KPC9zdmc+" 
                    alt="Logo" 
                    className="w-full h-full object-cover p-1.5"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-[10px] font-bold text-slate-800 leading-tight">
                  小钥匙客服
                </div>
              </div>
              
              <h1 className="text-3xl font-black text-rose-600 tracking-widest mb-1">{posterData.projectName}</h1>
              <h2 className="text-5xl font-black text-rose-600 tracking-[0.2em] mb-6">{posterData.reportTitle}</h2>
              <p className="text-rose-600 font-bold text-lg mb-2">{posterData.slogan}</p>
              <div className="w-48 h-0.5 bg-rose-600 mb-2"></div>
              <p className="text-rose-600 font-bold text-sm">——{posterData.dateRange}</p>
            </div>

            {/* Main Work Section */}
            <div className="w-full px-8 py-10 flex flex-col items-center">
              <h3 className="text-3xl font-black text-white mb-8 tracking-widest">本周主要工作</h3>
              <div className="w-full space-y-4">
                {posterData.mainWork.map((work, idx) => (
                  <div key={idx} className="flex items-start gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center flex-shrink-0">
                      <CheckSquare className="w-6 h-6 text-rose-600" />
                    </div>
                    <p className="text-white text-xl font-bold leading-tight pt-1">{work}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Sections */}
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="w-full px-6 py-6 flex flex-col items-center">
                {/* Category Header */}
                <div className="bg-rose-500 px-10 py-3 rounded-full mb-8 shadow-lg border-2 border-white/20">
                  <h3 className="text-2xl font-black text-white tracking-widest">{cat.title}</h3>
                </div>

                {/* Photo Grid */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx} className="aspect-[4/3] bg-white/20 rounded-3xl overflow-hidden relative group cursor-pointer border-2 border-white/10">
                      {posterData.categoryPhotos[cat.id]?.[idx] ? (
                        <>
                          <img 
                            src={posterData.categoryPhotos[cat.id][idx]} 
                            className="w-full h-full object-cover" 
                            alt={`Service ${idx}`} 
                          />
                          {/* Watermark Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white">
                            <div className="flex items-end justify-between">
                              <div className="text-[10px] font-bold leading-tight opacity-90">
                                <p>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | {new Date().toLocaleDateString()}</p>
                                <p>星期{['日','一','二','三','四','五','六'][new Date().getDay()]} | 晴 12°C</p>
                                <p>达拉特旗 · {posterData.projectName}</p>
                              </div>
                              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                                <ImageIcon className="w-3 h-3" />
                              </div>
                            </div>
                          </div>
                          {/* Remove Button (Editor Only) */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); removePhoto(cat.id, idx); }}
                            className="absolute top-2 right-2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/30 transition-all">
                          <Camera className="w-10 h-10 text-white/60 mb-2" />
                          <span className="text-white/60 font-bold text-sm">点选照片</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handlePhotoUpload(cat.id, idx, e)} 
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Footer / Next Week Plan */}
            <div className="w-full bg-rose-700 px-10 py-12 flex flex-col items-center mt-10">
              <h3 className="text-3xl font-black text-white mb-8 tracking-widest">下周工作计划</h3>
              <div className="w-full space-y-4 mb-10">
                {posterData.nextWeekPlan.map((plan, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-white font-black text-xl">{idx + 1}.</span>
                    <p className="text-white text-lg font-bold leading-relaxed">{plan}</p>
                  </div>
                ))}
              </div>
              <div className="w-full border-t border-white/20 pt-8 flex flex-col items-center">
                <p className="text-white text-lg font-bold mb-2">如需帮助，请拨打客服中心电话：{posterData.contactPhone}</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <p className="text-white/60 text-sm">用心服务 · 温暖邻里</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
