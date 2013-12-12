package com.teamsun.pc.tebe.filters;

import java.io.IOException;
import java.util.Date;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.teamsun.pc.tebe.utils.DateUtils;

@WebFilter(urlPatterns={"*.html","*.css","*.js","*.json"})
public class AssetsFilter implements Filter{
	@Override
	public void doFilter(ServletRequest req,ServletResponse res,FilterChain chain) throws IOException,ServletException{
		HttpServletRequest request=(HttpServletRequest)req;
		HttpServletResponse response=(HttpServletResponse)res;
		response.setHeader("Expires",DateUtils.toGMTString(new Date(0)));
		response.setHeader("Cache-Control","no-cache");
		response.setCharacterEncoding("UTF-8");
		chain.doFilter(request,response);
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException{
		
	}

	@Override
	public void destroy(){
		
	}
}
