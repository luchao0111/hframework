package com.hframework.web.config.bean.module;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamImplicit;
import java.util.List;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;

/**
 * generated by hframework on 2016.
 */@XStreamAlias("component")
public class Component   {

    //配置与组件为一个Event对象，否则处理上需要转换
	@XStreamImplicit
    @XStreamAlias("event")
	private List<com.hframework.web.config.bean.component.Event> eventList;
    @XStreamImplicit
    @XStreamAlias("set-value")
    private List<SetValue> setValueList;
	@XStreamAsAttribute
    @XStreamAlias("id")
	private String id;
	@XStreamAsAttribute
    @XStreamAlias("data-set")
	private String dataSet;
	@XStreamAsAttribute
    @XStreamAlias("dataid")
	private String dataid;
    @XStreamAsAttribute
    @XStreamAlias("title")
    private String title;
    @XStreamAsAttribute
    @XStreamAlias("show-title")
    private String showTitle;

    @XStreamAsAttribute
    @XStreamAlias("event-extend")
    private String eventExtend;

    @XStreamAsAttribute
    @XStreamAlias("path")
    private String path;

    public Component() {
    }
   
 	 	 
     public List<com.hframework.web.config.bean.component.Event> getEventList(){
     	return eventList;
     }

     public void setEventList(List<com.hframework.web.config.bean.component.Event> eventList){
     	this.eventList = eventList;
     }
	 	 	 
     public String getId(){
     	return id;
     }

     public void setId(String id){
     	this.id = id;
     }
	 	 	 
     public String getDataSet(){
     	return dataSet;
     }

     public void setDataSet(String dataSet){
     	this.dataSet = dataSet;
     }
	 	 	 
     public String getDataid(){
     	return dataid;
     }

     public void setDataid(String dataid){
     	this.dataid = dataid;
     }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getEventExtend() {
        return eventExtend;
    }

    public void setEventExtend(String eventExtend) {
        this.eventExtend = eventExtend;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getShowTitle() {
        return showTitle;
    }

    public void setShowTitle(String showTitle) {
        this.showTitle = showTitle;
    }

    public List<SetValue> getSetValueList() {
        return setValueList;
    }

    public void setSetValueList(List<SetValue> setValueList) {
        this.setValueList = setValueList;
    }
}
