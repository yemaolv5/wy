import React, { useState } from 'react';
import { Search, Book, FileText, AlertCircle, Heart, Users, Scale, Info, ChevronRight, Copy, CheckCircle2 } from 'lucide-react';
import { KnowledgeItem } from '../types';
import { cn } from '../utils';
import { generateNotice } from '../services/gemini';

const KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: 'l1',
    title: '《民法典》第942条：物业服务人义务',
    content: '物业服务人应当按照约定和物业的使用性质，妥善维修、养护、清洁、绿化和经营管理物业服务区域内的共有部分，维护物业服务区域内的基本秩序，采取合理措施保护业主的人身、财产安全。',
    type: 'law',
    category: '民法典'
  },
  {
    id: 'l2',
    title: '《民法典》第944条：业主支付物业费义务',
    content: '业主应当按照约定向物业服务人支付物业费。物业服务人已经按照约定和有关规定提供服务的，业主不得以未接受或者无需接受相关物业服务为由拒绝支付物业费。',
    type: 'law',
    category: '民法典'
  },
  {
    id: 'c1',
    title: '案例：楼上漏水，物业有责任吗？',
    content: '【解读】若漏水点在业主室内自用部位，由楼上业主承担维修及赔偿责任；若漏水点在共有部位（如主排水管），由物业负责维修，费用可申请维修基金。物业在纠纷中负有协调、查勘及告知义务。',
    type: 'case',
    category: '常见纠纷'
  },
  {
    id: 'c2',
    title: '案例：高空抛物找不到人怎么办？',
    content: '【解读】《民法典》规定，经调查难以确定具体侵权人的，除能够证明自己不是侵权人的外，由可能加害的建筑物使用人给予补偿。物业若未采取必要的安全保障措施，也需承担相应的补充责任。',
    type: 'case',
    category: '常见纠纷'
  }
];

const TEMPLATES = [
  { id: 't1', title: '停水通知', type: 'emergency', icon: <AlertCircle className="w-4 h-4" /> },
  { id: 't2', title: '停电通知', type: 'emergency', icon: <AlertCircle className="w-4 h-4" /> },
  { id: 't3', title: '文明养犬提醒', type: 'warm', icon: <Heart className="w-4 h-4" /> },
  { id: 't4', title: '高空抛物警示', type: 'warm', icon: <Info className="w-4 h-4" /> },
  { id: 't5', title: '社区活动招募', type: 'activity', icon: <Users className="w-4 h-4" /> },
];

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'template' | 'law'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const filteredKnowledge = KNOWLEDGE_BASE.filter(item => 
    item.title.includes(searchQuery) || item.content.includes(searchQuery)
  );

  const handleGenerateTemplate = async (title: string) => {
    setSelectedTemplate(title);
    setLoading(true);
    try {
      const content = await generateNotice(title, "请根据该主题生成一份标准的物业通知模板。");
      setGeneratedContent(content || '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">通告与知识查询</h2>
          <p className="text-slate-500">标准化通知模板与专业法律法规支撑</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜索法规、案例或模板..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('template')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
              activeTab === 'template' ? "bg-primary text-white shadow-lg shadow-emerald-100" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
            )}
          >
            <FileText className="w-5 h-5" />
            常规通知模板
          </button>
          <button 
            onClick={() => setActiveTab('law')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
              activeTab === 'law' ? "bg-primary text-white shadow-lg shadow-emerald-100" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
            )}
          >
            <Scale className="w-5 h-5" />
            法律法规库
          </button>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'template' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  选择模板类型
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleGenerateTemplate(t.title)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border transition-all text-left group",
                        selectedTemplate === t.title ? "border-primary bg-emerald-50" : "bg-white border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          t.type === 'emergency' ? "bg-red-100 text-red-600" : t.type === 'warm' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                        )}>
                          {t.icon}
                        </div>
                        <span className="font-medium text-slate-700">{t.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">通知预览</h3>
                  {generatedContent && (
                    <button 
                      onClick={handleCopy}
                      className={cn(
                        "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                        copied ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? "已复制" : "复制"}
                    </button>
                  )}
                </div>
                <div className="flex-1 bg-slate-50 rounded-xl p-6 font-sans text-sm whitespace-pre-wrap text-slate-700 border border-slate-200">
                  {loading ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p>正在为您撰写通知模板...</p>
                    </div>
                  ) : generatedContent ? (
                    generatedContent
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center space-y-2">
                      <FileText className="w-8 h-8 opacity-20" />
                      <p>请从左侧选择一个模板主题</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredKnowledge.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase",
                      item.type === 'law' ? "bg-blue-500" : "bg-orange-500"
                    )}>
                      {item.type === 'law' ? '法律条文' : '案例解析'}
                    </span>
                    <span className="text-xs text-slate-400">{item.category}</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.content}</p>
                </div>
              ))}
              {filteredKnowledge.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                  <Search className="w-12 h-12 mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400">未找到相关法规或案例</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
