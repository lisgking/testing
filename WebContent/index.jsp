<%@page import="javax.el.ResourceBundleELResolver"%>
<%@page import="java.util.Locale"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<title>Document</title>
</head>
<body>
	<%request.setAttribute("include","/prelude.jsp");%>
	<jsp:include page="${include}" />
</body>
</html>