<?php
/**
 * Displays all of the head element and everything up until the "site-content" div.
 */
?><!DOCTYPE html>

<html <?php language_attributes(); ?>>

<!-- Begin Cookie Consent plugin by Silktide - http://silktide.com/cookieconsent -->
<script type="text/javascript">
    window.cookieconsent_options = {"message":"Ce site internet utilise des cookies afin de vous offrir la meilleur experience possible.","dismiss":"OK","learnMore":"Plus d'infos","link":null,"theme":"dark-bottom"};
</script>

<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/1.0.9/cookieconsent.min.js"></script>
<!-- End Cookie Consent plugin -->

<!-- Google Analytics -->
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-72658527-1', 'auto');
ga('send', 'pageview');
</script>
<!-- End Google Analytics -->

<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width">
    <meta name="title" content="Ce Havre qui t'appelle" />
    <title>Ce Havre qui t'appelle</title>
    <link rel="shortcut icon" href="%%THEME_URL%%assets/images/brand-logo-small-black.png" />
    <base href= %%BASE_HREF%%>
    <link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
    <!--[if lt IE 9]>
    <script src="<?php echo esc_url( get_template_directory_uri() ); ?>/js/html5.js"></script>
    <![endif]-->
    <?php wp_head(); ?>
</head>

<body ng-app='app'>
<div id="page">
    <header id="masthead" class="site-header" role="banner">
        <div id="header-bg">
            <img interchange="
                [%%THEME_URL%%assets/images/banner-large.jpg, (small)],
                [%%THEME_URL%%assets/images/banner-xlarge.jpg, (medium)]">
        </div>
        <div id="site-branding">
           <a href="./">
                <img interchange=
                        "[%%THEME_URL%%assets/images/brand-small.png, (small)],
                        [%%THEME_URL%%assets/images/brand-medium.png, (medium)],
                        [%%THEME_URL%%assets/images/brand-l.png, (large)]"
                     src="%%THEME_URL%%assets/images/brand-small.png"
                     alt="Ce havre qui t'appelle">
            </a>
        </div>
    </header>

   <!-- The menu is not in a template because of the need to load parts
        depending on whether the user is logged in or not  -->
    <div id=top-bar-container class="sticky" ng-controller="topbarCtrl">
        <top-bar is-hover="false" scrolltop="false">
           <ul class="title-area">
               <li class="name" ng-click="home()">
                    <img src="%%THEME_URL%%assets/images/brand-logo-small-black.png" alt="">
               </li>
               <li class="menu-icon" toggle-top-bar>
                   <a href="#"><i class="icon-menu"></i></a>
               </li>
           </ul>
           <top-bar-section>
               <ul class="left">
<!--
                   Deleted the blog section altogether
                    <li><a href="blog">Blog</a></li>
-->
                    <li><a href="about">Qui sommes-nous?</a></li>
                    <li>
                        <button class="button hide-for-small-only" type="button" ng-click="newStory()">
                            Racontez votre histoire!
                        </button>
                    </li>
               </ul>
           </top-bar-section>
           <top-bar-section>
               <ul class="right">
                    <li has-dropdown>
                         <a href="#">
<?php if(is_user_logged_in()): ?>
                             <span>{{user.display_name}}</span>
<?php endif; ?>
                             <i class="icon-user"></i>
                         </a>
                         <ul top-bar-dropdown>
<?php if(!is_user_logged_in()): ?>
                             <li>
                                 <a ng-click="login()">
                                     <i class="icon-login"></i>
                                     Se connecter
                                 </a>
                             </li>
                             <li>
                                 <a ng-click="logup()">
                                     <i class="icon-user-plus"></i>
                                     S'enregistrer
                                 </a>
                             </li>
<?php endif;
      if(is_user_logged_in()): ?>
                             <li>
                                 <a href="my-stories">
                                     <i class="icon-comment"></i>
                                     Mes histoires
                                 </a>
                             </li>
                             <li>
                                 <a href="my-profile">
                                     <i class="icon-user"></i>
                                     Mon profil
                                 </a>
                             </li>
    <?php if(current_user_can('edit_users')): ?>
                             <li>
                                 <a href="wp-admin" target="_blank">
                                    <i class="icon-wrench"></i>
                                     Administration
                                 </a>
                             </li>
    <?php endif; ?>
                             <li>
                                 <a href="<?php echo wp_logout_url( home_url() ); ?>">
                                     <i class="icon-logout"></i>
                                     Se déconnecter
                                 </a>
                             </li>
<?php endif;?>
                         </ul>
                    </li>
               </ul>
           </top-bar-section>
        </top-bar>
    </div>

    <div id="content" class="site-content">
