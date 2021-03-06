package com.hframework.web.config.bean;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.hframework.web.config.bean.datasethelper.*;

/**
 * generated by hframework on 2016.
 */@XStreamAlias("helper")
public class DataSetHelper   {

	@XStreamAlias("help-module")
	private String helpModule;
	@XStreamAlias("help-dataset")
	private String helpDataset;
    @XStreamAlias("help-datascore")
    private String helpDatascore;
	@XStreamAlias("effect-module")
	private String effectModule;
	@XStreamAlias("effect-dataset")
	private String effectDataset;
    @XStreamAlias("is-dynamic")
    private String isDynamic;
	@XStreamAlias("mappings")
	private Mappings mappings;



    public DataSetHelper() {
    }
   
 	 	 
     public String getHelpModule(){
     	return helpModule;
     }

     public void setHelpModule(String helpModule){
     	this.helpModule = helpModule;
     }
	 	 	 
     public String getHelpDataset(){
     	return helpDataset;
     }

     public void setHelpDataset(String helpDataset){
     	this.helpDataset = helpDataset;
     }
	 	 	 
     public String getEffectModule(){
     	return effectModule;
     }

     public void setEffectModule(String effectModule){
     	this.effectModule = effectModule;
     }
	 	 	 
     public String getEffectDataset(){
     	return effectDataset;
     }

     public void setEffectDataset(String effectDataset){
     	this.effectDataset = effectDataset;
     }
	 	 	 
     public Mappings getMappings(){
     	return mappings;
     }

     public void setMappings(Mappings mappings){
     	this.mappings = mappings;
     }

     public String getHelpDatascore() {
      return helpDatascore;
     }

     public void setHelpDatascore(String helpDatascore) {
      this.helpDatascore = helpDatascore;
     }

     public String getIsDynamic() {
      return isDynamic;
     }

     public void setIsDynamic(String isDynamic) {
      this.isDynamic = isDynamic;
     }
}
